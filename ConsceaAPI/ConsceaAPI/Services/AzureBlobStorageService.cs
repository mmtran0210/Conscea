using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ConsceaAPI.Helpers;
using ConsceaAPI.Interfaces;
using static ConsceaAPI.Helpers.Constants;

namespace ConsceaAPI.Services;

public class AzureBlobStorageService : IStorageService
{
    private readonly IConfiguration _config;

    public AzureBlobStorageService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<Uri> UploadAsync(Stream stream, string fileName)
    {
        BlobClient blob = GetBlobClient(fileName);

        if (await blob.ExistsAsync())
        {
            throw new ConflictException("File already uploaded");
        }

        // Specify the content type as "image/jpeg"
        BlobHttpHeaders headers = new BlobHttpHeaders
        {
            ContentType = "image/jpeg"
        };

        await blob.UploadAsync(stream, headers);

        return blob.Uri;
    }

    private async Task<bool> DeleteFileAsync(string fileName)
    {
        BlobClient blob = GetBlobClient(fileName);

        return await blob.DeleteIfExistsAsync();
    }

    private BlobContainerClient GetBlobContainer()
    {
        return new BlobContainerClient(_config[ConfigKey.StorageConnectionString], _config[ConfigKey.AvatarContainerName]);
    }

    private BlobClient GetBlobClient(string blobName)
    {
        return GetBlobContainer().GetBlobClient(blobName);
    }
}
