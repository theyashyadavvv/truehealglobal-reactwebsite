
import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertToolbar } from '../components/Alert';
import CustomButton from '../components/CustomButton';
import {
    HiBell,
    HiCheckCircle,
    HiExclamation,
    HiInformationCircle,
    HiShieldExclamation
} from 'react-icons/hi';
import GradientButton from '../components/GradientButton'; // Keep consistent navigation

export default function AlertDemoPage() {
    return (
        <div style={{ minHeight: '100vh', padding: '4rem 2rem', background: '#fff' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 className="section-title">Alert & Button Components</h1>
                    <p className="section-subtitle">Premium UI elements adapted to Vanilla CSS</p>
                    <div style={{ marginTop: '2rem' }}>
                        <GradientButton onClick={() => window.location.href = '/'}>
                            Back to Home
                        </GradientButton>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Primary Alert */}
                    <Alert variant="primary" close={true}>
                        <AlertIcon>
                            <HiBell />
                        </AlertIcon>
                        <AlertTitle>This is a primary alert</AlertTitle>
                        <AlertToolbar>
                            <CustomButton variant="inverse" mode="link" underlined="solid" size="sm">
                                Upgrade
                            </CustomButton>
                        </AlertToolbar>
                    </Alert>

                    {/* Success Alert */}
                    <Alert variant="success" close={true}>
                        <AlertIcon>
                            <HiCheckCircle />
                        </AlertIcon>
                        <AlertTitle>This is a success alert</AlertTitle>
                        <AlertToolbar>
                            <CustomButton variant="inverse" mode="link" underlined="solid" size="sm">
                                View
                            </CustomButton>
                        </AlertToolbar>
                    </Alert>

                    {/* Destructive Alert */}
                    <Alert variant="destructive" close={true}>
                        <AlertIcon>
                            <HiExclamation />
                        </AlertIcon>
                        <AlertTitle>This is a destructive alert</AlertTitle>
                        <AlertToolbar>
                            <CustomButton variant="inverse" mode="link" underlined="solid" size="sm">
                                Retry
                            </CustomButton>
                        </AlertToolbar>
                    </Alert>

                    {/* Info Alert */}
                    <Alert variant="info" close={true}>
                        <AlertIcon>
                            <HiInformationCircle />
                        </AlertIcon>
                        <AlertTitle>This is an info alert</AlertTitle>
                    </Alert>

                    {/* Warning Alert */}
                    <Alert variant="warning" close={true}>
                        <AlertIcon>
                            <HiShieldExclamation />
                        </AlertIcon>
                        <AlertTitle>This is a warning alert</AlertTitle>
                    </Alert>

                    {/* Light Variant Examples */}
                    <h3 className="section-label" style={{ marginTop: '2rem' }}>Light Appearance</h3>

                    <Alert variant="primary" appearance="light" close={true}>
                        <AlertIcon><HiBell /></AlertIcon>
                        <AlertTitle>Primary Light</AlertTitle>
                    </Alert>

                    <Alert variant="destructive" appearance="light" close={true}>
                        <AlertIcon><HiExclamation /></AlertIcon>
                        <AlertTitle>Destructive Light</AlertTitle>
                    </Alert>

                    <Alert variant="success" appearance="light" close={true}>
                        <AlertIcon><HiCheckCircle /></AlertIcon>
                        <AlertTitle>Success Light</AlertTitle>
                    </Alert>

                </div>
            </div>
        </div>
    );
}
