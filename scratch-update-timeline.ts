import prisma from './src/db';

async function updateTimeline() {
  const sectorId = '5f18779c-d03c-42b1-8948-7f2fb5b17516';
  console.log(`Updating timeline for sector ${sectorId}...`);

  const timeline = await prisma.section.findFirst({
    where: { sectorId, type: 'AboutTimeline' }
  });

  if (!timeline) {
    console.log('No timeline section found.');
    return;
  }

  const newContent = {
    title: 'WELCOME TO EDULARN TIMELINE',
    subtitle: 'Considering desire as primary motivation for the generation support.',
    events: [
      { 
        date: '2000 Jan 14', 
        title: 'Establishment of Company', 
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.', 
        icon: 'fa fa-pencil' 
      },
      { 
        date: '2005 March 18', 
        title: 'Increase employees by 5000 members', 
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.', 
        icon: 'fa fa-image', 
        mediaType: 'image', 
        mediaUrl: '/images/about/history.jpg' 
      },
      { 
        date: '2008 Feb 14', 
        title: 'Registration of Company', 
        text: 'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.', 
        icon: 'fa fa-video-camera', 
        mediaType: 'video', 
        mediaUrl: 'https://0.s3.envato.com/h264-video-previews/dc4f42f5-8742-4e3c-bb1a-41e292b4aa11/17885303.mp4' 
      },
      { 
        date: '2010 Apr 10', 
        title: 'Branches open in International', 
        text: 'A wonderful serenity has taken possession of my entire soul...', 
        icon: 'fa fa-youtube', 
        mediaType: 'iframe', 
        mediaUrl: 'https://www.youtube.com/embed/uQBL7pSAXR8' 
      },
      { 
        date: '2015 Feb 26', 
        title: 'Opened 6 branch Worldwide', 
        text: '', 
        icon: 'fa fa-rocket', 
        mediaType: 'quote', 
        quoteText: "For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.", 
        quoteSource: "From WWF's website" 
      }
    ]
  };

  await prisma.section.update({
    where: { id: timeline.id },
    data: { content: newContent as any }
  });

  console.log('✅ Timeline updated successfully!');
}

updateTimeline()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
