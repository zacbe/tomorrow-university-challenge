
export const createOneLesson = async (lesson: any): Promise<any> => {
  try {
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        challenges: lesson.challenges || [],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to save lesson:', error);
    throw error;
  }
}

export const findOneLesson = async (id: string): Promise<Lesson> => {
  try {
    const res = await fetch(`/api/lessons/${id}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to get lesson:', error);
    throw error;
  }
}

export const deleteOneLesson = async (id: string): Promise<any> => {
  try {
    const res = await fetch(`/api/lessons/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to delete lesson:', error);
    throw error;
  }
}

export const findAllLessons = async (
  ids: string[] = [], 
  page: number = 1, 
  limit: number = 10
): Promise<any> => {

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (ids.length > 0) {
      queryParams.append('filter[ids]', ids.join(','));
    }

    const res = await fetch(`/api/lessons?${queryParams.toString()}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to get lessons:', error);
    throw error;
  }
}
