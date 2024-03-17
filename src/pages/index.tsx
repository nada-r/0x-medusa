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
        <div className="flex flex-col items-center justify-center align-middle min-h-screen">
            {!isVerified && ( // This block will only render if isVerified is false
                <>
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
                </>
            )}

            {isVerified && ( // This block will render after successful verification
                <div className="mt-8 flex flex-col items-center justify-center">
                    <h1 className="text-3xl mb-4">0xmedusa</h1>
                    <img src="https://m.media-amazon.com/images/I/B1i3u9-Q-KS._CLa%7C2140%2C2000%7CB1nL5ios7SL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UY1000_.png" alt="0xmedusa" className="w-64 h-64 object-cover mb-4" />
                    <button onClick={() => window.location.href='https://main--0xmedusa3.netlify.app/us/store'} className="transition-fg relative inline-flex items-center justify-center overflow-hidden rounded-md outline-none disabled:bg-ui-bg-disabled disabled:border-ui-border-base disabled:text-ui-fg-disabled disabled:shadow-buttons-neutral disabled:after:hidden after:transition-fg after:absolute after:inset-0 after:content-[''] shadow-buttons-inverted text-white bg-black after:button-inverted-gradient hover:bg-black hover:after:button-inverted-hover-gradient active:bg-black active:after:button-inverted-pressed-gradient focus:!shadow-buttons-inverted-focus txt-compact-small-plus gap-x-1.5 px-3 py-1.5 w-full h-10" type="button">Add to Cart</button>
                </div>
            )}
        </div>
    );
}

