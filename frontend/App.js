import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/context';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        <PaperProvider>
            <AuthProvider>
                <AppNavigator />
            </AuthProvider>
        </PaperProvider>
    );
};

export default App;
