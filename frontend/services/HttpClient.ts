type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: object;
  queryParams?: QueryParams;
}

export class HttpClient {
  constructor(private baseUrl: string) {}

  async request<T>(path: string = "", options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, queryParams } = options;
    const url = this.getUrl(path, queryParams);
    const requestOptions: RequestInit = { method };

    if (body) {
      requestOptions.headers = { "Content-Type": "application/json" };
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при выполнении ${method} запроса к ${url}:`, error);
      throw error;
    }
  }

  private getUrl(path: string = "", queryParams?: QueryParams): string {
    const url = `${this.baseUrl}${path}`;
    const queryString = this.buildQueryString(queryParams);
    return queryString ? `${url}${queryString}` : url;
  }

  private buildQueryString(params?: QueryParams): string {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}
