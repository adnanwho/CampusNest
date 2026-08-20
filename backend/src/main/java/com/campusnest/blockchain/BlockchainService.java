package com.campusnest.blockchain;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
@Slf4j
public class BlockchainService {

    private final boolean enabled;
    private final String privateKey;
    private final String contractAddress;
    private final String rpcUrl;
    private final String networkName;
    private final String explorerUrl;

    public BlockchainService(
            @Value("${campusnest.blockchain.enabled:false}") boolean enabled,
            @Value("${campusnest.blockchain.private-key:}") String privateKey,
            @Value("${campusnest.blockchain.contract-address:}") String contractAddress,
            @Value("${campusnest.blockchain.rpc-url}") String rpcUrl,
            @Value("${campusnest.blockchain.network-name}") String networkName,
            @Value("${campusnest.blockchain.explorer-url}") String explorerUrl
    ) {
        this.enabled = enabled;
        this.privateKey = privateKey;
        this.contractAddress = contractAddress;
        this.rpcUrl = rpcUrl;
        this.networkName = networkName;
        this.explorerUrl = explorerUrl;
    }

    public String computeRecordHash(Long propertyId, Long listerId, String timestamp, String status) {
        String payload = propertyId + "|" + listerId + "|" + timestamp + "|" + status;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return "0x" + HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to compute record hash", e);
        }
    }

    public BlockchainResult registerVerification(Long propertyId, String recordHash) {
        if (!enabled || privateKey == null || privateKey.isBlank()) {
            String mockTx = "mock-tx-" + propertyId + "-" + System.currentTimeMillis();
            log.warn("Blockchain disabled — returning mock transaction {}", mockTx);
            return new BlockchainResult(recordHash, mockTx, networkName, contractAddress, explorerUrl + "/tx/" + mockTx);
        }
        try {
            Web3j web3j = Web3j.build(new HttpService(rpcUrl));
            Credentials credentials = Credentials.create(privateKey);
            TransactionManager txManager = new RawTransactionManager(web3j, credentials, 80002L);
            VerificationRegistryContract contract = VerificationRegistryContract.load(
                    contractAddress, web3j, txManager, new DefaultGasProvider());
            byte[] hashBytes = hexToBytes32(recordHash);
            var receipt = contract.registerVerification(BigInteger.valueOf(propertyId), hashBytes);
            String txHash = receipt.getTransactionHash();
            return new BlockchainResult(recordHash, txHash, networkName, contractAddress, explorerUrl + "/tx/" + txHash);
        } catch (Exception e) {
            log.error("Blockchain registration failed", e);
            String fallbackTx = "failed-tx-" + propertyId + "-" + System.currentTimeMillis();
            return new BlockchainResult(recordHash, fallbackTx, networkName, contractAddress, explorerUrl + "/tx/" + fallbackTx);
        }
    }

    public record BlockchainResult(
            String recordHash,
            String transactionHash,
            String networkName,
            String contractAddress,
            String explorerUrl
    ) {}

    private byte[] hexToBytes32(String hex) {
        String cleaned = hex.startsWith("0x") ? hex.substring(2) : hex;
        byte[] bytes = HexFormat.of().parseHex(cleaned);
        if (bytes.length == 32) return bytes;
        byte[] padded = new byte[32];
        System.arraycopy(bytes, 0, padded, 32 - bytes.length, bytes.length);
        return padded;
    }
}
