import React, { MouseEvent } from 'react';
import TracerLoading from '@components/TracerLoading';
interface TProps {
    show: boolean;
    title?: string;
    subTitle?: string;
    onClose: (event: MouseEvent) => void;
    children: React.ReactNode;
    loading: boolean;
}

const TracerModal: React.FC<TProps> = (props: TProps) => {
    return (
        <>
            {props.show ? (
                <>
                    <div className="justify-center items-center text-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-xl min-w-1/4">
                            {/*content*/}
                            <div className="border-0 rounded-lg box-shadow relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex justify-between p-3 rounded-t text-center mx-auto">
                                    <h3 className="text-3xl font-bold text-blue-100 flex-col">{props.title}</h3>
                                    <span
                                        onClick={props.onClose}
                                        className="bg-transparent cursor-pointer text-blue-100 h-6 w-6 text-2xl block outline-none focus:outline-none absolute right-0 top-0 pr-5 mr-3 pt-4"
                                    >
                                        ×
                                    </span>
                                </div>
                                <div className="h-screen/50 flex flex-col">
                                    {!props.loading ? (
                                        <>
                                            <div className="border-b-2 border-gray-100">
                                                <h4 className="p-6 text-blue-100 text-lg">{props.subTitle}</h4>
                                            </div>
                                            {/* body */}
                                            <div className="w-full h-full">{props.children}</div>
                                        </>
                                    ) : (
                                        <div className="m-auto text-blue-100">
                                            <TracerLoading />
                                            <div className="pt-2">...processing...</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
};

export default TracerModal;
