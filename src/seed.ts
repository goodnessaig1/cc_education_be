import prisma from './db';
import bcrypt from 'bcryptjs';

const GLOBAL_SECTIONS = ['InfoBar', 'Navbar', 'Footer'];
const HOME_SECTIONS = [
  'Hero', 'Services', 'AboutUs', 'SearchCourses', 'PopularCourses', 'CoursesGrid',
  'Achievements', 'UpcomingEvents', 'CourseCategories', 'WhyChooseUs', 'Team',
  'CTA', 'PricingPlan', 'LatestNews', 'Testimonials', 'Partners', 'Instagram',
  'Video', 'Products'
];
const ABOUT_SECTIONS = [
  'Breadcrumbs', 'AboutHistory', 'AboutMission', 'AboutVision', 'AboutTimeline', 'AboutBranches',
  'Team', 'CTA', 'Partners'
];
const CONTACT_SECTIONS = ['Breadcrumbs', 'ContactSection', 'Partners'];

function getContent(type: string, pageContext: string) {
  if (type === 'InfoBar') return { phone: '+1 123 456 7890', email: 'info@edulearn.com', address: '503 Old Buffalo Street', showSocials: true };
  if (type === 'Navbar') return { navItems: [{ label: 'About Us', href: '/about' }, { label: 'Contact', href: '/contact' }], showSearch: true };
  if (type === 'Footer') return { copyright: '© 2026 Edulearn. All Rights Reserved.', aboutText: 'Leading education platform.', newsletterTitle: 'Newsletter' };
  
  if (type === 'Hero') return { slides: [{ image: "/images/slider/home1/slide1.jpg", title: "WELCOME", desc: "Test", showTitle: true, showDesc: true, showBtn1: true, btn1Text: "READ MORE", btn1Link: "#" }] };
  if (type === 'AboutUs') return { title: 'ABOUT EDULEARN', subtitle: 'The best provider', text: 'We provide high quality education.', image: '/images/about/about-1.jpg' };
  if (type === 'Services') return { title: 'OUR SERVICES', items: [] };
  if (type === 'ContactSection') return { 
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18", 
    addressLines: ["503 Old Buffalo Street"], phones: ["+123"], emails: ["info@example.com"],
    showMap: true, showAddress: true, showPhone: true, showEmail: true, showForm: true 
  };
  if (type === 'Breadcrumbs') return { title: pageContext.toUpperCase(), crumbs: [{ label: 'Home', href: '/' }, { label: pageContext, href: '#' }] };
  
  return { title: type.toUpperCase() };
}

async function main() {
  console.log('🌱 Baseline seeding for CMS...');
  
  // 1. Admin account
  const existingAdmin = await prisma.admin.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({ data: { username: 'admin', password: hashed } });
    console.log('✅ Created admin (admin/admin123)');
  }

  // 2. SiteConfig
  const existingConfig = await prisma.siteConfig.findUnique({ where: { id: 'default-config' } });
  if (!existingConfig) {
    await prisma.siteConfig.create({
      data: {
        id: 'default-config',
        layoutType: 'home1',
        siteTitle: 'Edulearn CMS',
        colors: { primary: "#ff3115", secondary: "#212121", bg: "#ffffff", text: "#000000" }
      }
    });
    console.log('✅ Created default config');
  }

  // 3. Pages and Sections
  const pages = [
    { name: 'Home', slug: '/', sections: ['InfoBar', 'Navbar', ...HOME_SECTIONS, 'Footer'] },
    { name: 'About Us', slug: '/about', sections: ['InfoBar', 'Navbar', ...ABOUT_SECTIONS, 'Footer'] },
    { name: 'Contact Us', slug: '/contact', sections: ['InfoBar', 'Navbar', ...CONTACT_SECTIONS, 'Footer'] }
  ];

  for (const p of pages) {
    let page = await prisma.page.findUnique({ where: { slug: p.slug } });
    if (!page) {
      page = await prisma.page.create({ data: { name: p.name, slug: p.slug } });
      let order = 0;
      for (const type of p.sections) {
        await prisma.section.create({
          data: {
            type,
            pageId: page.id,
            variation: 'style1',
            isVisible: true,
            order: order++,
            content: getContent(type, p.name) as any
          }
        });
      }
      console.log(`✅ Created page ${p.name}`);
    }
  }

  // 4. Initial Publish Deployment
  const config = await prisma.siteConfig.findUnique({ where: { id: 'default-config' } });
  const allPages = await prisma.page.findMany({ include: { sections: { orderBy: { order: 'asc' } } } });
  
  await prisma.publishedDeployment.upsert({
    where: { id: 'live' },
    update: { data: { config, pages: allPages } },
    create: {
      id: 'live',
      data: { config, pages: allPages }
    }
  });

  console.log('✅ Initial site published to "live" deployment');
  console.log('\n🎉 Seeding complete!');
}

if (require.main === module) {
  main()
    .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
}
