import { useState } from 'react';
import { VerificationLevel, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";

export default function Home() {
    const [isVerified, setIsVerified] = useState(false); // State to track if the user has been verified

    if (!process.env.NEXT_PUBLIC_WLD_APP_ID) {
        throw new Error("app_id is not set in environment variables!");
    }
    if (!process.env.NEXT_PUBLIC_WLD_ACTION) {
        throw new Error("app_id is not set in environment variables!");
    }

    const onSuccess = (result: ISuccessResult) => {
        window.alert("Successfully verified with World ID! Your nullifier hash is: " + result.nullifier_hash);
        setIsVerified(true); // Set user as verified on successful verification
    };

    const handleProof = async (result: ISuccessResult) => {
        // Your existing proof handling logic...
    };

    return (
        <div className="flex flex-col items-center justify-center align-middle h-screen">
            <p className="text-2xl mb-5">Exclusive offer? Check your humanity</p>
            <IDKitWidget
                action={process.env.NEXT_PUBLIC_WLD_ACTION!}
                app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`}
                onSuccess={onSuccess}
                handleVerify={handleProof}
                verification_level={VerificationLevel.Orb}
            >
                {({ open }) =>
                    <button className="border border-black rounded-md" onClick={open}>
                        <div className="mx-3 my-1">Verify with World ID</div>
                    </button>
                }
            </IDKitWidget>

            {isVerified && (
                <div className="mt-8">
                    <p className="text-xl mb-4">Checkout Form</p>
                    <form className="flex flex-col">
                        <input className="border rounded-md p-2 mb-4" type="text" placeholder="Full Name" required />
                        <input className="border rounded-md p-2 mb-4" type="email" placeholder="Email" required />
                        <input className="border rounded-md p-2 mb-4" type="text" placeholder="Address" required />
                        <input className="border rounded-md p-2 mb-4" type="text" placeholder="City" required />
                        <input className="border rounded-md p-2 mb-4" type="text" placeholder="Zip Code" required />
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" type="submit">Place Order</button>
                    </form>
                </div>
            )}
        </div>
    );
}
