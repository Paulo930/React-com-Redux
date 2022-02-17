import React from 'react';
import { STATS_GET } from '../../api';
import useFetch from '../../Hooks/useFetch';
import Error from '../helper/Error';
import Head from '../helper/Head';
import Loading from '../helper/Loading';
const UserStatsGraphs = React.lazy(() => import('./UserStatsGraphs'));

const UserStats = () => {
  const { data, error, loading, request } = useFetch();

  React.useEffect(() => {
    async function getData() {
      const { url, options } = STATS_GET();
      await request(url, options);
    }
    getData();
  }, [request]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data)
    return (
      <div>
        <React.Suspense fallback={<div></div>}>
          <Head title="Estatísticas" />
          <UserStatsGraphs data={data} />
        </React.Suspense>
      </div>
    );
  return null;
};

export default UserStats;
