import { HttpClient, QueryParams, RequestOptions } from "./HttpClient.ts";

export interface ListResponse<T> {
  data: T[];
  totalCount: number;
}
interface ExistenceObject {
  exists: boolean;
}

export class ApiService<T> {
  private httpClient: HttpClient;

  constructor(private entityName: string) {
    this.httpClient = new HttpClient(`/api/${entityName}`);
  }

  async getList(filters?: QueryParams): Promise<ListResponse<T>> {
    try {
      return await this.httpClient.request<ListResponse<T>>("", { queryParams: filters });
    } catch (error) {
      return { data: [], totalCount: 0 };
    }
  }

  async getById(id: string | number): Promise<T | null> {
    try {
      const url = this.getByIdUrl(id);

      return await this.httpClient.request<T>(url);
    } catch (error) {
      return null;
    }
  }

  async create(data: Partial<T>): Promise<T | null> {
    try {
      const url = this.getCreateUrl();
      const options: RequestOptions = { method: "POST", body: data };

      return await this.httpClient.request<T>(url, options);
    } catch (error) {
      return null;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const url = this.getUpdateUrl(id);
      const options: RequestOptions = { method: "PATCH", body: data };

      return await this.httpClient.request<T>(url, options);
    } catch (error) {
      return null;
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const url = this.getDeleteUrl(id);
      const options: RequestOptions = { method: "DELETE" };

      await this.httpClient.request(url, options);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkExistence(entity: string, filters: QueryParams): Promise<ExistenceObject | null> {
    try {
      const httpClient = new HttpClient("");
      const url = this.getExistenceUrl(entity);

      return await httpClient.request<ExistenceObject>(url, { queryParams: filters });
    } catch (error) {
      return null;
    }
  }

  private getByIdUrl(id: string | number): string {
    return `/${id}`;
  }

  private getCreateUrl(): string {
    return "/create";
  }

  private getUpdateUrl(id: string | number): string {
    return `/${id}/update`;
  }

  private getDeleteUrl(id: string | number): string {
    return `/${id}/delete`;
  }

  private getExistenceUrl(entity: string): string {
    return `/${entity}-exists`;
  }
}
