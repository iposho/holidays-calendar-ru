import { getReadmeContent } from '@/helpers/getReadmeContent';

const HomePage = async () => {
  const content = await getReadmeContent();

  return (
    <div className="container mx-auto p-4">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default HomePage;
