import { getCollection, type CollectionEntry } from 'astro:content';

export interface CourseSection {
  slug: string;
  title: string;
  order: number;
  lessons: CollectionEntry<'courses'>[];
}

export async function getCourseStructure(courseSlug?: string): Promise<CourseSection[]> {
  let lessons = await getCollection('courses');
  
  // Filter by course if specified
  if (courseSlug) {
    lessons = lessons.filter(l => l.id.startsWith(courseSlug + '/'));
  }

  // Group lessons by section name
  const sectionMap = new Map<string, {
    order: number;
    lessons: CollectionEntry<'courses'>[];
  }>();

  for (const lesson of lessons) {
    const sectionName = lesson.data.section ?? '';
    const sectionOrder = lesson.data.sectionOrder ?? 0;
    
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, { order: sectionOrder, lessons: [] });
    }
    sectionMap.get(sectionName)!.lessons.push(lesson);
  }

  // Convert to array and sort
  const sections: CourseSection[] = [];
  for (const [title, { order, lessons: sectionLessons }] of sectionMap) {
    // Sort lessons within section by order
    sectionLessons.sort((a, b) => a.data.order - b.data.order);
    
    sections.push({
      slug: title.toLowerCase().replace(/\s+/g, '-') || 'overview',
      title,
      order,
      lessons: sectionLessons,
    });
  }

  // Sort sections by order, then by title alphabetically as tiebreaker
  sections.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return sections;
}

export async function getCourseLessons(courseSlug: string): Promise<CollectionEntry<'courses'>[]> {
  const lessons = await getCollection('courses');
  return lessons
    .filter(l => l.id.startsWith(courseSlug + '/'))
    .sort((a, b) => a.data.order - b.data.order);
}
