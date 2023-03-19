import type { lastlyViewedData } from "../models/lastlyViewedData.model";

class LocalStorageService {
  setLastlyViewedData(courseId: string, data: lastlyViewedData) {
    return localStorage.setItem(
      `${courseId}-lastly-viewed`,
      JSON.stringify(data)
    );
  }

  getLastlyViewedData(courseId: string) {
    return localStorage.getItem(`${courseId}-lastly-viewed`);
  }
}

export default new LocalStorageService();
