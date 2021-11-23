import { JsonStrip } from "./utils";
import { Alerter } from "./alerter";

const Config = {
    defaultConfig : {
        debug: false,
        tileDirectory: "images/tiles",
        iconDirectory: "images/icons",
        showIdentifiers: false,
        groupPlayers: true,
        defaults: {
            ip: "127.0.0.1",
            socketPort: "30121"
        },
        servers: []
    },

    staticConfig: {},

    getConfig: () => {
        if (JSON.stringify(this.staticConfig) === "{}") {
            this.getConfigFileFromRemote();
            console.warn("config didn't exist... try getting it again");
        }

        return this.staticConfig;
    },

    getConfigFileFromRemote: async ()=>{
        const lang = window.Translator;

        try {
            let config = await fetch("config.json");

            let configData = await config.text();
            // console.log("Parsing: ", configData);

            let str = JsonStrip.stripJsonOfComments(configData);
            let configParsed = JSON.parse(str);
            Config.staticConfig = Object.assign(Config.defaultConfig, configParsed);

            return Promise.resolve(configParsed);

        } catch (ex) {
            console.error(ex);
            new Alerter({
                status: "error",
                title: lang.t("errors.getting-config.title"),
                text: lang.t("errors.getting-config.message", { error: ex })
            });
            return Promise.reject(ex);
        }
    }

}

export { Config };
