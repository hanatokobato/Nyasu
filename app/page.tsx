import axios from 'axios';
import Link from 'next/link';
import LearnButton from './components/buttons/LearnButton';
import Chart from './review/components/Chart';
import WaitReviewBtn from './review/components/WaitReviewBtn';

const getData = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/learnings`);
  const { word_levels, wait_review_count, curr_review_count, upcoming } =
    res.data;
  return { word_levels, wait_review_count, curr_review_count, upcoming };
};

const Home = async () => {
  const { word_levels, wait_review_count, curr_review_count, upcoming } =
    await getData();

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="flex justify-center flex-wrap mx-6 mt-2">
          <div className="w-7/12 mt-20">
            <Chart wordLevels={word_levels} />
            <div className="text-center mt-12">
              {wait_review_count > 0 && (
                <p className="mb-12">Chuẩn bị ôn tập: {wait_review_count} từ</p>
              )}
              {curr_review_count === 0 && <WaitReviewBtn date={upcoming} />}
              {curr_review_count > 0 && (
                <Link href="/review">
                  <LearnButton className="w-60">ÔN TẬP NGAY</LearnButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Home;
