import { PaymentLink } from "../models/PaymentLink.js";
import { createWalletClientFromPrivateKey } from '../config/viem.js';

interface IPaymentLink {
  linkId: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentLinkService {
    static async createPaymentLink(userId: string, amount: number, linkID: string): Promise<IPaymentLink> {
         const paymentLink = await PaymentLink.create({
            linkId: linkID,
            userId,
            amount,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return paymentLink as IPaymentLink;
    }

    static async createPaymentLinkOnChain(privateKey: string, linkID: string, amount: string): Promise<string> {
        try {
            console.log('Creating payment link on chain:', { linkID, amount });
            
            // Use viem's wallet client which handles CrossFI properly
            const walletClient = createWalletClientFromPrivateKey(privateKey);
            
            if (!walletClient.account) {
                throw new Error('No account found in wallet client');
            }

            console.log('Wallet client created for address:', walletClient.account.address);

            // Import viem utilities
            const { parseEther } = await import('viem');
            const { PAYLINK_CONTRACT_ADDRESS } = await import('../constants/contract.js');
            const { PAYLINK_ABI } = await import('../constants/abi.js');

            // Convert amount to Wei using viem
            const amountInWei = parseEther(amount);
            console.log('Amount converted to Wei:', amountInWei.toString());

            console.log('Calling contract at:', PAYLINK_CONTRACT_ADDRESS);
            console.log('With args:', [linkID, amountInWei]);

            // Call the smart contract using viem
            const hash = await walletClient.writeContract({
                address: PAYLINK_CONTRACT_ADDRESS as `0x${string}`,
                abi: PAYLINK_ABI,
                functionName: 'createFixedPaymentLink',
                args: [linkID, amountInWei],
            } as any);

            console.log('Payment link created on chain:', hash);
            return hash;
        } catch (error: any) {
            console.error('Error creating payment link on chain:', error.message);
            throw new Error(`Failed to create payment link on chain: ${error.message}`);
        }
    }
}