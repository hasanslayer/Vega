// We created this model because in EF Core not support yet many-to-many relationship
using System.ComponentModel.DataAnnotations.Schema;

namespace Vega.Core.Models
{
    [Table("VehicleFeatures")]
    public class VehicleFeature
    {
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public int FeatureId { get; set; }
        public Feature Feature { get; set; }

    }
}