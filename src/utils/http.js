const api_url = "https://alantur-api.softplix.com/v1/";

export async function getHobNotifications() {
  try {
    const response = await fetch(`${api_url}get-hob-notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
export async function getNotificationsDetails({ id }) {
  try {
    const response = await fetch(`${api_url}get-experience-details/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
export async function markNotificationRead({ id }) {
  try {
    const response = await fetch(`${api_url}mark-notification-read/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
