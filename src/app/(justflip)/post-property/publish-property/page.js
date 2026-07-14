import React from 'react'
import PublishPropertyClient from '../../components/PostProperty/PublishProperty/PublishPropertyClient';
import SiteService from '@/src/services/SiteService';

async function PublishProperty() {
      const { cities } = await SiteService.fetchPopularCities({ offset: 0, limit: 15 });
  return (
    <div className=''>
        <PublishPropertyClient initialCities={cities} />
    </div>
  )
}

export default PublishProperty;