const LabelDivider = (props: { text: string }) => (
    <div>
        <hr className='mt-6' />
        <h2 className='text-md font-semibold text-gray-400 bg-white mb-3 -mt-3 pr-4 w-fit'>
            {props.text}
        </h2>
    </div>
);

export default LabelDivider;
