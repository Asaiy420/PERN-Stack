import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";
import dotenv from "dotenv"

dotenv.config();

// initializing arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    //BOT DETECTION
    characteristics: ["ipsrc"],
    rules:[
        // shield protects our site from attacks like, SQL Injection, XSS, CSRF, and other such.
        shield({mode:"LIVE"}),
        detectBot({
            mode: "LIVE",
            //block all bots except search engines
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        //RATE LIMITING
        tokenBucket({
            mode:"LIVE",
            refillRate: 5,
            interval:10,
            capacity:10,
        })
    ]

})