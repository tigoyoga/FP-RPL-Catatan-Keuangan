import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
type ModalProps = {
  isOpen: boolean;
  title: string;

  closeModal: () => void;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
};

const Modal = ({
  children,
  isOpen,
  closeModal,
  title,
  onSubmit,
}: ModalProps) => {
  const methods = useForm();
  const { handleSubmit } = methods;

  // clear data and error in form when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      methods.reset();
      methods.clearErrors();
    }
  }, [isOpen]);

  return (
    <div>
      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {}}>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={React.Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    {title}
                  </Dialog.Title>

                  <button
                    type='button'
                    className='absolute top-0 right-0 mt-6 mr-6'
                    onClick={closeModal}
                  >
                    <span className='sr-only'>Close</span>
                    <MdClose className='h-6 w-6 text-gray-400 hover:text-gray-500' />
                  </button>

                  <div className='mt-4'>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {children}
                        <div className='mt-4 space-x-2 flex justify-end'>
                          <button
                            type='submit'
                            className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                          >
                            Buat
                          </button>
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Modal;