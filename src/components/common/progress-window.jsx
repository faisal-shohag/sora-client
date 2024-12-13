import PropTypes from 'prop-types';

const ProgressWindow = ({progressbar}) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-svh">
      <h1 className='text-4xl font-bold text-center'>~<span className='text-red-500'>日本</span>~ Learn</h1>
        <center>{progressbar}</center>
        <div>Please wait...</div>
      </div>
    </div>
  );
};

ProgressWindow.propTypes = {
  progressbar: PropTypes.node.isRequired,
};

export default ProgressWindow;