import React from 'react'
import visualIdentity from '../../assets/visualIdentity.svg'

const AboutPeskon = () => {
  return (
    <>
      <div className='flex flex-col '>
        <div className='flex justify-center w-screen '>
          <div className='flex items-center lg:my-[-4rem] my-5 mx-[3rem] '>
            <div className='flex flex-col h-fit max-w-[40rem] sm:gap-3 gap-3 sm:m-0 mx-2 my-4'>
              <h1 className='text-peskonrun-primary text-2xl sm:text-3xl md:text-4xl font-semibold'>About Peskon</h1>
              <p className='text-peskonrun-primary md:text-[1.2rem] text-[0.9rem] md:leading-8  min-w-[20rem] '>Pesta Konvokesyen (PESKON) UPM, is an annual celebration held in conjunction with Universiti Putra Malaysia’s convocation ceremony. The festival brings together students, graduates, families, and the community through cultural performances, exhibitions, food stalls, and exciting activities that showcase UPM’s vibrant campus life.</p>
            </div>

            <img src={visualIdentity} alt="gambar" className=' lg:max-w-[36rem] md:max-w-[28rem] sm:max-w-[18rem] w-full h-auto  sm:block hidden' />
          </div>

          
        </div>

        <div className='flex justify-center'>
          <hr class="h-px my-5 md:w-[80%] w-[87%] bg-neutral-quaternary text-peskonrun-primary  "></hr>
        </div>

      </div>




    </>

  )
}

export default AboutPeskon