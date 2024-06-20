const helpScoutKey = 'e5581505-fe63-4968-81ce-dfdadf0ceaf1';
const helpScoutDomain = 'https://beacon-v2.helpscout.net';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const browserWindow = window as any;

const appendHelpScoutSnippet = () => {
    if (browserWindow.helpScoutIsInitialized) return false;
    ((window, document, beacon) => {
        const appendTag = (): void => {
            const firstScriptTag = document.getElementsByTagName('script')[0];
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.id = 'helpScoutBeaconScript';
            newScript.async = !0;
            newScript.src = helpScoutDomain;
            newScript.setAttribute('nonce', browserWindow.nonce);

            if (firstScriptTag && firstScriptTag.parentNode) {
                browserWindow.helpScoutIsInitialized = true;
                firstScriptTag.parentNode.insertBefore(newScript, firstScriptTag);
            }
        };
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const provideInitialMethods = () => {
            window.Beacon = beacon = (
                doc: Document,
                hsBeacon: any,
                append: () => void
            ) => {
                browserWindow.Beacon.readyQueue.push({
                    method: doc,
                    options: hsBeacon,
                    data: append,
                });
            };
            beacon.readyQueue = [];
            return appendTag();
        };
        /* eslint-enable @typescript-eslint/no-explicit-any */

        if ('complete' === document.readyState) {
            provideInitialMethods();
        }
        window.attachEvent
            ? window.attachEvent('onload', provideInitialMethods)
            : window.addEventListener('load', provideInitialMethods, !1);
    })(browserWindow, document, browserWindow.Beacon || null);

    return true;
};

export const initializeHelpScout = (name?: string, email?: string): void => {
    /**
     * There is no way to detect if Beacon is initialized or destroyed, so we have to check if the container
     * that their JS creates exists on the DOM and if it has any children elements.
     */
    const helpScoutBeacon = browserWindow.Beacon;
    const beaconContainer = browserWindow.document.getElementById(
        'beacon-container'
    );
    if (
        helpScoutBeacon &&
        (!beaconContainer || beaconContainer.children.length === 0)
    ) {
        browserWindow.helpScoutIsReady = false;
        helpScoutBeacon('init', helpScoutKey);
        helpScoutBeacon('identify', {
            name,
            email,
        });
        helpScoutBeacon('on', 'ready', () => {
            browserWindow.helpScoutIsReady = true;
        });
    }
};

export const destroyHelpScout = (): void => {
    const helpScoutBeacon = browserWindow.Beacon;
    const helpScoutScriptTag = browserWindow.document.getElementById(
        'helpScoutBeaconScript'
    );
    if (helpScoutBeacon) {
        helpScoutBeacon('off', 'ready');
        helpScoutBeacon('destroy');
        if (helpScoutScriptTag) {
            browserWindow.helpScoutIsInitialized = false;
            helpScoutScriptTag.remove();
        }
    }
};

export const destroyHelpScoutWhenReady = () => {
    const helpScoutBeacon = browserWindow.Beacon;
    if (helpScoutBeacon) {
        if (browserWindow.helpScoutIsReady) {
            destroyHelpScout();
        } else {
            helpScoutBeacon('on', 'ready', () => {
                destroyHelpScout();
            });
        }
    }
};

export const loadHelpScout = (): void => {
    const hasSnippetElement = browserWindow.document.getElementById(
        'helpScoutSnippet'
    );

    const userName = 'Name';
    const userEmail = 'email';

    if (!hasSnippetElement) {
        appendHelpScoutSnippet();
    }
    initializeHelpScout(userName, userEmail);
};
