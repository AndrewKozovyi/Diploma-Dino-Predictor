using System;
using System.Collections.Generic;
using DinoPredictorAPI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DinoPredictorAPI.Persistence;

public partial class DinoPredictorDbContext : DbContext
{
    public DinoPredictorDbContext(DbContextOptions<DinoPredictorDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<DinoType> DinoTypes { get; set; }

    public virtual DbSet<DinoTypeTranslation> DinoTypeTranslations { get; set; }

    public virtual DbSet<PredictHistoryRequest> PredictHistoryRequests { get; set; }

    public virtual DbSet<PredictHistoryResult> PredictHistoryResults { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DinoType>(entity =>
        {
            entity.HasIndex(e => e.Code, "UQ_DinoTypes_Code").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<DinoTypeTranslation>(entity =>
        {
            entity.HasKey(e => new { e.DinoTypeId, e.Culture });

            entity.Property(e => e.Culture)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.DinoType).WithMany(p => p.DinoTypeTranslations)
                .HasForeignKey(d => d.DinoTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_DinoTypeTranslations_DinoTypes");
        });

        modelBuilder.Entity<PredictHistoryRequest>(entity =>
        {
            entity.HasIndex(e => e.CreatedAt, "IX_PredictHistoryRequests_CreatedAt").IsDescending();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CamImagePublicId)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt)
                .HasPrecision(3)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_PredictHistoryRequests_CreatedAt");
            entity.Property(e => e.ImagePublicId)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.ModelVersion)
                .HasMaxLength(64)
                .IsUnicode(false);
            entity.Property(e => e.OriginalFileName).HasMaxLength(255);
        });

        modelBuilder.Entity<PredictHistoryResult>(entity =>
        {
            entity.HasKey(e => new { e.RequestId, e.DinoTypeId });

            entity.HasIndex(e => new { e.DinoTypeId, e.RequestId }, "IX_PredictHistoryResults_Top1_DinoTypeId").HasFilter("([Rank]=(1))");

            entity.HasIndex(e => new { e.RequestId, e.Rank }, "UQ_PredictHistoryResults_RequestId_Rank").IsUnique();

            entity.Property(e => e.Probability).HasColumnType("decimal(5, 4)");

            entity.HasOne(d => d.DinoType).WithMany(p => p.PredictHistoryResults)
                .HasForeignKey(d => d.DinoTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PredictHistoryResults_DinoTypes");

            entity.HasOne(d => d.Request).WithMany(p => p.PredictHistoryResults)
                .HasForeignKey(d => d.RequestId)
                .HasConstraintName("FK_PredictHistoryResults_PredictHistoryRequests");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
