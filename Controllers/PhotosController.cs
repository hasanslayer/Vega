using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vega.Controllers.Resources;
using Vega.Core;
using Vega.Core.Models;

namespace Vega.Controllers
{
    // /api/vehicles/1/photos/[] // [] for delete
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly int MAX_BYTES = 10 * 1024 * 1024;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };
        private readonly IHostingEnvironment host;
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        public PhotosController(IHostingEnvironment host, IVehicleRepository repository, IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.host = host;


        }

        [HttpPost]
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file) // IFormFile : used to get data from the uploaded file and ICollectionFile : for multiple files
        {
            var vehicle = await repository.GetVehicle(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();

            if (file == null) return BadRequest("Null file.");
            if (file.Length == 0) return BadRequest("Empty file.");
            if (file.Length > MAX_BYTES) return BadRequest("Max file size exceeded.");
            if (!ACCEPTED_FILE_TYPES.Any(s => s == Path.GetExtension(file.FileName))) return BadRequest("Invalid file type.");

            // host.WebRootPath // wwwroot folder
            var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolderPath))
                Directory.CreateDirectory(uploadsFolderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName); // Guid: for security best practices about files name
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photo = new Photo { FileName = fileName };
            vehicle.Photos.Add(photo);
            await unitOfWork.CompleteAsync();

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }
    }
}