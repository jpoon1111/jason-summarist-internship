"use client";

import BookCard from '@/components/BookCard';
import ProtectedRoute from '@/components/ProtectedRoute';
const demo = {
  "id": "f9gy1gpai8",
  "author": "Eric Ries",
  "title": "The Lean Startup",
  "subTitle": "How Constant Innovation Creates Radically Successful Businesses",
  "imageLink": "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Fimages%2Fthe-lean-startup.png?alt=media&token=087bb342-71d9-4c07-8b0d-4dd1f06a5aa2",
  "audioLink": "https://firebasestorage.googleapis.com/v0/b/summaristt.appspot.com/o/books%2Faudios%2Fthe-lean-startup.mp3?alt=media&token=c2f2b1d4-eaf2-4d47-8c8a-7a8fd062a47e",
  "totalRating": 981,
  "averageRating": 4.6,
  "keyIdeas": 11,
  "type": "Audio & Text",
  "status": "selected",
  "subscriptionRequired": true,
  "summary": "The Lean Startup is a book by entrepreneur and startup consultant Eric Ries that offers a methodology for building successful startups. The book is based on Ries’ experiences working with startups, and his belief that many of the traditional approaches to building a business are flawed and can lead to wasted resources and failure. The Lean Startup offers a new approach to entrepreneurship that emphasizes rapid iteration, customer feedback, and a focus on delivering value to the customer. \n\n Part One: Vision \n\n The first section of The Lean Startup introduces the key concepts and principles of the lean startup methodology. Ries argues that traditional approaches to entrepreneurship are based on a flawed assumption that startups can simply follow a linear process to success, starting with a well-defined business plan and executing that plan flawlessly. He argues that in reality, startups are much more complex and uncertain, and that the key to success is to be able to navigate this uncertainty by constantly iterating and learning from customer feedback. \n\n Part Two: Steer \n\n The second section of The Lean Startup explores the process of steering a startup towards success. Ries argues that startups should focus on delivering value to the customer as quickly and efficiently as possible, and that the best way to do this is by using a process of continuous experimentation and iteration. He also emphasizes the importance of measuring progress and using data to inform decision-making, and offers insights into the types of metrics that are most valuable for startups. \n\n Part Three: Accelerate \n\n The third section of The Lean Startup focuses on strategies for accelerating the growth of a startup. Ries argues that startups should focus on building a scalable business model that can be rapidly expanded once product-market fit has been established. He also offers advice on how to build a strong team, how to manage resources effectively, and how to create a culture of innovation and experimentation. \n\n Key Themes \n\n The Lean Startup is a powerful and influential book that has revolutionized the way many entrepreneurs approach building a business. Some of the key themes of the book include: \n\n Rapid Iteration: The Lean Startup emphasizes the importance of rapid iteration and experimentation in building a successful startup. By quickly testing new ideas and incorporating customer feedback, startups can minimize the risk of failure and maximize the chances of success. \n\n Customer Focus: The Lean Startup places a strong emphasis on delivering value to the customer. By focusing on what the customer wants and needs, startups can create products and services that are more likely to succeed in the market. \n\n Data-Driven Decision Making: The Lean Startup encourages startups to use data to inform decision-making. By measuring progress and using data to track key metrics, startups can make more informed decisions and avoid wasting resources on initiatives that are unlikely to succeed. \n\n Continuous Improvement: The Lean Startup advocates for a culture of continuous improvement, in which startups are constantly looking for ways to improve their products and processes. By embracing a mindset of continuous improvement, startups can stay ahead of the competition and build sustainable long-term success. \n\n Conclusion \n\n The Lean Startup is a must-read for anyone interested in building a successful startup. Ries’ methodology is based on years of experience working with startups, and his insights into the key factors that contribute to startup success are both powerful and actionable. By embracing the principles of the Lean Startup, entrepreneurs can minimize the risk of failure and maximize their chances of building a sustainable, successful business.",
  "tags": [
    "Productivity",
    "Personal Development"
  ],
  "bookDescription": "\"The Lean Startup\" is a book written by entrepreneur and startup advisor Eric Ries. First published in 2011, the book presents a methodology for building and scaling startups in a more efficient and effective manner. The approach emphasizes continuous experimentation, rapid iteration, and customer feedback, with the goal of creating a product or service that meets the needs of the market. The book introduces the concept of a minimum viable product (MVP), which is a version of the product that has just enough features to satisfy early customers and provide feedback for further development. Ries also discusses the importance of validated learning, which involves testing assumptions and hypotheses through experiments and data analysis. \"The Lean Startup\" has been widely read and praised for its practical and actionable advice, and has become a popular resource for entrepreneurs and startups looking to build successful and sustainable businesses.",
  "authorDescription": "Eric Ries is an entrepreneur, author, and startup advisor. Born in 1978 in California, Ries graduated from Yale University with a degree in computer science. He went on to co-found several startups, including IMVU, a 3D avatar-based social networking platform, and later became an advisor and mentor to numerous other startups. Ries is best known for his book \"The Lean Startup,\" which introduced a new approach to building and scaling startups based on continuous experimentation and customer feedback. He is also a frequent speaker and consultant on entrepreneurship, innovation, and management, and has been featured in numerous media outlets, including The New York Times, The Wall Street Journal, and Forbes. Ries has received several awards for his contributions to the startup community, and his work has influenced many entrepreneurs and startups around the world."
}

function page() {
  

  return (
    <ProtectedRoute>
        <div className='border-1 w-full max-w-[1070px] mx-auto px-6'>
          <div className='border-1 py-5 w-full'>

          <h2>Saved Books</h2>
          <p>0 items</p>
          <div className='finished__books--block-wrapper border-1'></div>
            <h3>Save your favorite books!</h3>
            <p>When you save a book, it will appear here.</p>
          </div>
        </div>
        <h3>Finished</h3>
        <p>{`13 Item s`}</p>
        <BookCard id={demo.id} title={demo.title} author={demo.author} subTitle={demo.subTitle} image={demo.imageLink} audioLink={demo.audioLink} rating={'4'} />
        
        Type '{}' is missing the following properties from type 'BookProps': id, title, author, subTitle, and 3 more.
    </ProtectedRoute>
  )
}

export default page