const DEVELOPMENT = 'development';

export class ServerService{

    constructor() {
        this.node_env = process.env.NODE_ENV;
    }

    isDev(){
        return this.node_env === DEVELOPMENT;
    }

    isDevelopment(){
        return this.isDev();
    }

    isProd(){
        return !this.isDev();
    }

    isProduction(){
        return this.isProd();
    }

    isServerSide(){
        return typeof window === 'undefined'
    }

}
