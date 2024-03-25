'use client'

import React, { useState } from 'react';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { getAccessTokenFromLocalStorage } from '@/app/lib/jwtHandler';
import { createTrialNetwork } from '@/app/lib/apiHandler';

export default function CreateTrialNetworkPage() {
    const [tnId, setTnId] = useState('');
    const [file, setFile] = useState(null);

    const handleTnIdChange = (event) => {
        setTnId(event.target.value);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const accessToken = await getAccessTokenFromLocalStorage();
            createTrialNetwork(accessToken, tnId, file)
            setTnId('');
            setFile(null);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <h1>Create Trial Network</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <a>Trial Network Identifier:</a>
                    <Input
                        type="text"
                        id="tnId"
                        placeholder="Enter Trial Network Identifier"
                        value={tnId}
                        onChange={handleTnIdChange}
                        className="input-login-register"
                    />
                </div>
                <div>
                    <a>Trial Network Descriptor:</a>
                    <Input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="input-login-register"
                    />
                </div>
                <Button type="submit" className="button-login-register">Submit</Button>
            </form>
        </div>
    );
};