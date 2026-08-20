package com.campusnest.blockchain;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

public class VerificationRegistryContract extends Contract {

    private static final String BINARY = "";

    protected VerificationRegistryContract(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider gasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, gasProvider);
    }

    public static VerificationRegistryContract load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider gasProvider) {
        return new VerificationRegistryContract(contractAddress, web3j, transactionManager, gasProvider);
    }

    public TransactionReceipt registerVerification(BigInteger propertyId, byte[] recordHash) throws Exception {
        Function function = new Function(
                "registerVerification",
                Arrays.asList(new Uint256(propertyId), new Bytes32(recordHash)),
                Collections.emptyList()
        );
        return executeRemoteCallTransaction(function).send();
    }
}
