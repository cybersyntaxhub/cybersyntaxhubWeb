const API_BASE = import.meta.env.VITE_API_URL || '';

const makeEntityClient = (entityName) => {
  return {
    list: async (sort, limit) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}`, window.location.origin);
      if (sort) url.searchParams.append('_sort', sort);
      if (limit) url.searchParams.append('_limit', String(limit));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Failed to list ${entityName}`);
      return res.json();
    },
    get: async (id) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}/${id}`, window.location.origin);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`Failed to get ${entityName} with id ${id}`);
      return res.json();
    },
    create: async (data) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}`, window.location.origin);
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Failed to create ${entityName}`);
      return res.json();
    },
    update: async (id, data) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}/${id}`, window.location.origin);
      const res = await fetch(url.toString(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`Failed to update ${entityName}`);
      return res.json();
    },
    delete: async (id) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}/${id}`, window.location.origin);
      const res = await fetch(url.toString(), {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`Failed to delete ${entityName}`);
      return res.json();
    },
    deleteMany: async (criteria) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}/deleteMany`, window.location.origin);
      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      if (!res.ok) throw new Error(`Failed to deleteMany ${entityName}`);
      return res.json();
    },
    filter: async (criteria, sort, limit) => {
      const url = new URL(`${API_BASE}/api/entities/${entityName}/filter`, window.location.origin);
      if (sort) url.searchParams.append('_sort', sort);
      if (limit) url.searchParams.append('_limit', String(limit));

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      });
      if (!res.ok) throw new Error(`Failed to filter ${entityName}`);
      return res.json();
    }
  };
};

export const base44 = {
  entities: {
    AppUser: makeEntityClient('AppUser'),
    Announcement: makeEntityClient('Announcement'),
    Assignment: makeEntityClient('Assignment'),
    Message: makeEntityClient('Message'),
    Course: makeEntityClient('Course'),
    CourseProgress: makeEntityClient('CourseProgress'),
    FormSubmission: makeEntityClient('FormSubmission')
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const url = new URL(`${API_BASE}/api/upload`, window.location.origin);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(url.toString(), {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('File upload failed');
        return res.json();
      }
    }
  }
};
