import React from 'react';
import BrokerPropertyUploadClient from '../../components/PostProperty/BrokerProperty/BrokerPropertyUploadClient';
import SiteService from '@/src/services/SiteService';

async function BrokerPropertyUpload() {
    const { cities } = await SiteService.fetchPopularCities({ offset: 0, limit: 15 });
    return (
        <div>
            <BrokerPropertyUploadClient initialCities={cities} />
        </div>
    );
}

export default BrokerPropertyUpload;