import { getCollection, type CollectionEntry } from 'astro:content';

export interface CourseSection {
  slug: string;
  title: string;
  order: number;
  comingSoon: boolean;
  lessons: CollectionEntry<'courses'>[];
}

interface GroupedCourse {
  slug: string;
  availableLessons: CollectionEntry<'courses'>[];
  comingSoonLessons: CollectionEntry<'courses'>[];
}

export async function getCourseStructure(): Promise<CourseSection[]> {
  const lessons = await getCollection('courses');

  // Group by course folder (first segment of id)
  const grouped = lessons.reduce((acc, lesson) => {
    const courseSlug = lesson.id.split('/')[0];
    if (!acc[courseSlug]) acc[courseSlug] = [];
    acc[courseSlug].push(lesson);
    return acc;
  }, {} as Record<string, CollectionEntry<'courses'>[]>);

  // Build grouped courses
  const groupedCourses: GroupedCourse[] = Object.entries(grouped).map(([slug, courseLessons]) => {
    const sortedLessons = courseLessons.sort((a, b) => a.data.order - b.data.order);
    return {
      slug,
      availableLessons: sortedLessons.filter(l => !l.data.comingSoon),
      comingSoonLessons: sortedLessons.filter(l => l.data.comingSoon),
    };
  });

  // Flatten into CourseSection format with available and coming soon split
  const result: CourseSection[] = [];

  for (const { slug, availableLessons, comingSoonLessons } of groupedCourses) {
    // Add available section
    if (availableLessons.length > 0) {
      result.push({
        slug,
        title: formatTitle(slug),
        order: 1,
        comingSoon: false,
        lessons: availableLessons,
      });
    }

    // Add coming soon section
    if (comingSoonLessons.length > 0) {
      result.push({
        slug: `${slug}-coming-soon`,
        title: 'Coming Soon',
        order: 2,
        comingSoon: true,
        lessons: comingSoonLessons,
      });
    }
  }

  return result;
}

export async function getCourseLessons(courseSlug: string): Promise<CollectionEntry<'courses'>[]> {
  const lessons = await getCollection('courses');
  return lessons
    .filter(l => l.id.startsWith(courseSlug + '/'))
    .sort((a, b) => a.data.order - b.data.order);
}

function formatTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
