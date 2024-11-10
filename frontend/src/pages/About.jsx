import React from 'react';
import { Timeline } from 'flowbite-react';
import { HiCalendar } from 'react-icons/hi';
import { Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <div className="relative flex flex-col items-center justify-center h-full text-blue-900 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-5xl font-bold">Discover Your Path</h1>
            <Sparkles className="w-8 h-8" />
          </div>
          <p className="text-xl max-w-2xl text-center">
            Empowering careers, connecting dreams, and building futures together at TrendingJobs4All
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 pb-16">
        <Timeline className="w-full max-w-4xl mx-auto">
          {timelineItems.map((item, index) => (
            <Timeline.Item
              key={index}
              className="transition-transform transform hover:scale-105 duration-500 border-l-2 border-blue-600 pl-6 mb-10"
            >
              <Timeline.Point
                icon={HiCalendar}
                className="text-white bg-blue-600 rounded-full p-2 shadow-lg"
              />
              <Timeline.Content className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Timeline.Time className="text-gray-600 text-sm font-medium">
                  {item.time}
                </Timeline.Time>
                <Timeline.Title className="text-2xl font-semibold text-gray-900 mt-2 mb-4">
                  {item.title}
                </Timeline.Title>
                <Timeline.Body className="text-gray-700 text-base leading-relaxed space-y-3">
                  {item.body.map((point, i) => (
                    <p key={i} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">▸</span>
                      <span>{point}</span>
                    </p>
                  ))}
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}

const timelineItems = [
  {
    time: "Our Mission",
    title: "Who Are We?",
    body: [
      "At TrendingJobs4All, we are a passionate team dedicated to bridging the gap between talented individuals and the career opportunities they deserve.",
      "Our platform is designed to help you discover job roles and internships that align with your skills, ambitions, and values.",
      "We believe in empowering individuals by connecting them with the right opportunities, ensuring that every step in your career is a fulfilling one.",
      "With a focus on innovation and user experience, CareerConnect is the ideal place for professionals and students to find their next big break."
    ]
  },
  {
    time: "Our Approach",
    title: "What Makes Us Different from Others?",
    body: [
      "TrendingJobs4All goes beyond the traditional job search experience by focusing on personalized career recommendations.",
      "We use advanced algorithms to match your unique skills, experiences, and aspirations with the most relevant opportunities.",
      "Our platform also offers tailored resources to help you upskill, network, and stay updated with industry trends.",
      "Moreover, we emphasize community building, giving you access to forums, mentorship, and career advice from experts.",
      "It's not just about finding a job — it's about finding the right career path for you."
    ]
  },
  {
    time: "Our Promise",
    title: "Why Choose Us?",
    body: [
      "Choosing TrendingJobs4All means choosing a platform that truly understands your career goals. We offer a seamless, intuitive experience to explore and apply for opportunities that resonate with your passion and skill set.",
      "With us, you are not just a job seeker; you are part of a community that supports continuous growth and success.",
      "Our commitment to offering curated opportunities, personalized insights, and professional development resources makes TrendingJobs4All the ultimate platform to advance your career. Join us and take the first step toward a brighter, more fulfilling professional future!"
    ]
  }
];
