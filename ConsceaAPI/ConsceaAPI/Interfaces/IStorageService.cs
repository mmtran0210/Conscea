namespace ConsceaAPI.Interfaces;

public interface IStorageService
{
    public Task<Uri> UploadAsync(Stream stream, string fileName);
}
