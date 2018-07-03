using System.Threading.Tasks;

namespace Vega.Persistence
{
    public interface IUnitOfWork
    {
        // the purpose of this class we can't with Db if we have more Repositories 
        // because we want to save all their works at one time

        Task CompleteAsync();
    }
}