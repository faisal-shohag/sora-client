import PropTypes from 'prop-types';

const ProgressWindow = ({progressbar}) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-svh">
      <h1 className='text-4xl font-bold text-center'>~<span className='text-red-500'>日本</span>~ Learn</h1>
        <div className='font-semibold'> A Japanese Vocabulary Learning Application</div>
        <div className='mt-2 rounded-full overflow-hidden'>{progressbar}</div>
        <div>Please wait...</div>
      </div>
    </div>
  );
};

ProgressWindow.propTypes = {
  progressbar: PropTypes.node.isRequired,
};

export default ProgressWindow;