export type Config = {
    LogLevel: 'debug' | 'trace' | 'info' | 'warning' | 'error',
    Component: string,
    Env: string,

    HostUrl: string,
    WebhookHostUrl: string,

    AuthServiceEndpoint: string,

    SophtronApiServiceEndpoint: string,
    SophtronVCServiceEndpoint: string,

    UcpClientId: string,
    UcpClientSecret: string,
    UcpEncryptionKey: string,

    SophtronApiUserId: string,
    SophtronApiUserSecret: string,

    MxClientId: string,
    MxApiSecret: string,
    MxClientIdProd: string,
    MxApiSecretProd: string,

    AkoyaClientId: string,
    AkoyaApiSecret: string,
    AkoyaClientIdProd: string,
    AkoyaApiSecretProd: string,

    FinicityPartnerId: string,
    FinicityAppKey: string,
    FinicitySecret: string,
    FinicityPartnerIdProd: string,
    FinicityAppKeyProd: string,
    FinicitySecretProd: string,
}

