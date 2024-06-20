import { useEffect } from 'react';
import {destroyHelpScoutWhenReady, loadHelpScout} from "~/components/HelpScoutService";


export const useHelpScoutScript = () => {
    useEffect(() => {
        loadHelpScout();
        return () => destroyHelpScoutWhenReady();
    }, []);
};
