import axios from "axios";
import { API_CONFIG} from "../config/apiConfig";

export class ImageApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async uploadImage(image: File): Promise<string> {
  try {
    const formData = new FormData();
    
    formData.append('image', image);

    const response = await axios.post<string>(
      `${this.baseUrl}/images/upload`,
      formData,
      {
        headers: {
        },
        withCredentials: true
      }
    );

    return response.data; // Вернется имя файла (string)
  } catch (error: any) {
    // Детальная отладка
    console.error('Upload failed:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    throw new Error(`Failed to upload image: ${error.response?.data || error.message}`);
  }
}

    /**
   * Удалить картинку по name
   */
  async deleteImage(imageName: string): Promise<void> {
    try {
      await axios.delete<string>(`${this.baseUrl}/images/${imageName}`, {
        headers: {
        },
        withCredentials: true
      });
    } catch (error) {
      throw Error(`Failed to get image: ${error}`);
    }
  }
}

export const imageApi = new ImageApi();