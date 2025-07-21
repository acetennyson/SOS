import { WebPlugin } from '@capacitor/core';
import { InAppBrowserPlugin, OpenInWebViewParameterModel, OpenInSystemBrowserParameterModel, OpenInDefaultParameterModel } from './definitions';
export declare class InAppBrowserWeb extends WebPlugin implements InAppBrowserPlugin {
    openInWebView(model: OpenInWebViewParameterModel): Promise<void>;
    openInSystemBrowser(model: OpenInSystemBrowserParameterModel): Promise<void>;
    openInExternalBrowser(model: OpenInDefaultParameterModel): Promise<void>;
    close(): Promise<void>;
}
