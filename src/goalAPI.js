// 
import API_BASE_URL from "./lib/api"; // Make sure path is correct

// Fetch user goals
export async function fetchUserGoals() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/goals`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store' ,
    });

    if (!response.ok) throw new Error('Failed to fetch user goals');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user goals:', error);
    return [];
  }
}

// Fetch goal types
export async function fetchGoalTypes() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/goals/config`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch goal types');

    const data = await response.json();
    return data.goals;
  } catch (error) {
    console.error('Error fetching goal types:', error);
    return [];
  }
}

// Create a new goal
export async function createGoal(goalData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/goals/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(goalData),
    });

    if (!response.ok) throw new Error('Failed to create goal');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating goal:', error);
  }
}

// Update an existing goal
export async function updateGoal(goalId, goalData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/goals/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ goal_id: goalId, ...goalData }),
    });

    if (!response.ok) throw new Error('Failed to update goal');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating goal:', error);
    return null;
  }
}

// goalAPI.js
export async function deleteGoal(goalId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/goals/delete?id=${goalId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to delete goal');
    return await res.json();
  } catch (error) {
    console.error("Error deleting goal:", error);
    return null;
  }
}

  