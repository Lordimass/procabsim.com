import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    sassOptions: {
        silenceDeprecations: ["import", "legacy-js-api", "color-functions", "if-function", "global-builtin"],
    },
    turbopack: {
        rules: {
            "*.md": {
                loaders: ["raw-loader"],
                as: "*.js"
            }
        }
    },
    redirects: () => {
        return [
            {
                source: "/refunds",
                destination: "/cancellations",
                permanent: true,
            }
        ]
    }
};

export default nextConfig;
