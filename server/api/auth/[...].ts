
//a code

import { NuxtAuthHandler } from '#auth';
import AzureADProvider from 'next-auth/providers/azure-ad';

async function refreshAccessToken(accessToken: any) {
    try {
        const url = `https://login.microsoftonline.com/d79878e7-6f5e-4b20-a0b9-53d22e1e6c86/oauth2/v2.0/token`;
        const req = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
            body: `grant_type=refresh_token` + `&client_secret=MvP8Q~pbNFhNamfiJTEwk3S-UclgPjA~vIg~LaxW` + `&refresh_token=${accessToken.refreshToken}` + `&client_id=f0377e7a-1e52-44ef-b414-3ee805576db3`,
        });

        const res = await req.json(); return {
            ...accessToken,
            accessToken: res.access_token,
            accessTokenExpires: Date.now() + res.expires_in * 10,
            refreshToken: res.refresh_token ?? accessToken.refreshToken, // Fall back to old refresh token        };    } catch (error) {        console.log(error);        return {            ...accessToken,            error: 'RefreshAccessTokenError',        };    }
        };
    } catch (error) {
        console.log(error);
        return { ...accessToken, error: 'RefreshAccessTokenError', };
    }
}

export default NuxtAuthHandler({
    secret: process.env.NUXT_AUTH_SECRET,
    providers: [
        AzureADProvider.default({
            clientId: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET,
            tenantId: process.env.AZURE_TENANT_ID,
            authorization: {
                params: {
                    scope: "openid profile email",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the access_token in the encrypted JWT.
            if (account && profile) {
                token.accessToken = account.access_token;
               // token.accessTokenExpires = account.expires_at / 10;
                token.accessTokenExpires = 1000;
                token.refreshToken = account.refresh_token;
                token.role = profile.roles[0]
            }
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // Make access token available on the client.
            session.accessToken = token.accessToken;
            session.role = token.role
            jwt:
            return session;
        },
    }
});