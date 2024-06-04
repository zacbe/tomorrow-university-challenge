
export const createOneChallenge = async (challenge: any): Promise<any> => {
  try {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: challenge.title,
        description: challenge.description,
        content: challenge.content,
        lessons: challenge?.lessons || [],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to save challenge:', error);
    throw error;
  }
}

export const findOneChallenge = async (id: string): Promise<Challenge> => {
  try {
    const res = await fetch(`/api/challenges/${id}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to get challenge:', error);
    throw error;
  }
}

export const deleteOneChallenge = async (id: string): Promise<any> => {
  try {
    const res = await fetch(`/api/challenges/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to delete challenge:', error);
    throw error;
  }
}

export const findAllChallenges = async (
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

    const res = await fetch(`/api/challenges?${queryParams.toString()}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Failed to get challenges:', error);
    throw error;
  }
}