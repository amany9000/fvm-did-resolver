import * as networkConfiguration from './configuration.json';
import { ethers } from 'ethers';
import {
    DIDDocument,
    DIDResolutionResult,
    DIDResolver,
    ParsedDID,
    Resolver,
} from 'did-resolver';
const DidRegistryContract = require('fvm-did-registry-contract');

/**
 * Resolves DID Document.
 * @param did
 * @returns Return DID Document on chain.
 */

export function getResolver(): Record<string, DIDResolver> {
    async function resolve(
        did: string,
        parsed?: ParsedDID
    ): Promise<DIDResolutionResult> {
        const didDocumentMetadata = {};
        try {
            let errorMessage: string;
            let url: string;
            let contractAddress: string;
            const didWithTestnet: string = await splitfvmDid(did);

            if (
                (did &&
                    didWithTestnet === 'testnet' &&
                    did.match(/^did:fvm:testnet:0x[0-9a-fA-F]{40}$/)) ||
                (did && did.match(/^did:fvm:0x[0-9a-fA-F]{40}$/))
            ) {
                if (
                    (didWithTestnet === 'testnet' &&
                        did.match(/^did:fvm:testnet:\w{0,42}$/)) ||
                    did.match(/^did:fvm:\w{0,42}$/)
                ) {
                    if (did && didWithTestnet === 'testnet') {
                        url = `${networkConfiguration[0].testnet?.URL}`;
                        contractAddress = `${networkConfiguration[0].testnet?.CONTRACT_ADDRESS}`;
                    } else {
                        errorMessage = `Wrong network enter!`;
                        throw new Error(errorMessage);
                    }

                    const provider: ethers.providers.JsonRpcProvider =
                        new ethers.providers.JsonRpcProvider(url);
                    const registry: ethers.Contract = new ethers.Contract(
                        contractAddress,
                        DidRegistryContract.abi,
                        provider
                    );

                    const didAddress: string =
                        didWithTestnet === 'testnet'
                            ? did.split(':')[3]
                            : didWithTestnet;

                    // Calling smart contract with getting DID Document
                    let didDocument: any = await registry.functions
                        .getDIDDoc(didAddress)
                        .then((resValue: any) => {
                            return resValue;
                        });

                    if (didDocument && !didDocument.includes('')) {
                        return {
                            didDocument,
                            didDocumentMetadata,
                            didResolutionMetadata: {
                                contentType: 'application/did+ld+json',
                            },
                        };
                    } else {
                        errorMessage = `The DID document for the given DID was not found!`;
                        throw new Error(errorMessage);
                    }
                } else {
                    errorMessage = `Invalid address has been entered!`;
                    throw new Error(errorMessage);
                }
            } else {
                errorMessage = `Invalid DID has been entered!`;
                throw new Error(errorMessage);
            }
        } catch (error) {
            throw error;
        }
    }
    return { fvm: resolve };
}

/**
 * Split fvm DID.
 * @param did
 * @returns Returns Split data value to fvm DID.
 */
async function splitfvmDid(did: string): Promise<string> {
    const splitDidValue: string = did.split(':')[2];
    return splitDidValue;
}
