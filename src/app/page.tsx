import Head from 'next/head';

import { getReadmeContent } from '@/helpers/getReadmeContent';

const HomePage = async () => {
  const content = await getReadmeContent();

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Производственный календарь</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default HomePage;
