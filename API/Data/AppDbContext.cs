namespace API.Data;

using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
  public DbSet<AppUser> Users { get; set; }
  public DbSet<Member> Members { get; set; }
  public DbSet<Photo> Photos { get; set; }
  public DbSet<MemberLike> Likes { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder
      .Entity<MemberLike>()
      .HasKey(memberLike => new { memberLike.SourceMemberId, memberLike.TargetMemberId });

    modelBuilder
      .Entity<MemberLike>()
      .HasOne(memberLiked => memberLiked.SourceMember)
      .WithMany(member => member.LikedMembers)
      .HasForeignKey(memberLiked => memberLiked.SourceMemberId)
      .OnDelete(DeleteBehavior.Cascade);

    modelBuilder
      .Entity<MemberLike>()
      .HasOne(memberLiked => memberLiked.TargetMember)
      .WithMany(member => member.LikedByMembers)
      .HasForeignKey(memberLiked => memberLiked.TargetMemberId)
      .OnDelete(DeleteBehavior.NoAction);

    var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
      value => value.ToUniversalTime(),
      value => DateTime.SpecifyKind(value, DateTimeKind.Utc)
    );

    foreach (var entityType in modelBuilder.Model.GetEntityTypes())
    {
      foreach (var property in entityType.GetProperties())
      {
        if (property.ClrType == typeof(DateTime))
        {
          property.SetValueConverter(dateTimeConverter);
        }
      }
    }
  }
}
