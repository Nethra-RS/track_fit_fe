// 
export async function fetchUserGoals(sessionToken) {
    try {
        const response = await fetch('/api/goals', {
        method: 'GET',
        headers: {
            'Cookie': `next-auth.session-token=${sessionToken}`
        },
        credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch user goals');

        const data = await response.json();
        console.log('User Goals:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user goals:', error);
        return [];
    }
}
  
// Fetch goal types from the backend
export async function fetchGoalTypes(urlCookie) {
    try {
        const response = await fetch('/api/goals/config', {
        method: 'GET',
        headers: {
            'Cookie': `next-auth.callback-url=${urlCookie}`,
        },
        credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch goal types');

        const data = await response.json();
        console.log('Goal Types:', data.goals);
        return data.goals;
    } catch (error) {
        console.error('Error fetching goal types:', error);
        return [];
    }
}
  
// Create a new goal in the backend
export async function createGoal(sessionToken, goalData) {
    try {
        const response = await fetch('/api/goals/create', {
        method: 'POST',
        headers: {
            'Cookie': `next-auth.session-token=${sessionToken}`,
            'Content-Type': 'application/json',
            
        },
        credentials: 'include',
        body: JSON.stringify(goalData)
        });

        if (!response.ok) throw new Error('Failed to create goal');

        const data = await response.json();
        console.log('Created Goal:', data);
        return data;
    } catch (error) {
        console.error('Error creating goal:', error);
    }
}
  