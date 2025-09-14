<?php

namespace App\DataFixtures;

use App\Entity\Exam;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ExamFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $examData = [
            ['Isabella.S', 'Martigues.B', '2026-06-16', '08:30:00', 'En recherche de place'],
            ['Léo.C', 'Martigues.B', '2026-05-26', '13:00:00', 'Annulé'],
            ['Lucas.R', 'Martigues.B', '2026-06-21', '14:00:00', 'Confirmé'],
            ['Franziska.S', 'Martigues.B', '2026-06-16', '08:30:00', 'À organiser'],
        ];

        foreach ($examData as [$studentName, $location, $date, $time, $status]) {
            $exam = new Exam();
            $exam->setStudentName($studentName);
            $exam->setLocation($location);
            $exam->setDate(new \DateTime($date));
            $exam->setTime(new \DateTime($time));
            $exam->setStatus($status);

            echo "Exam créé: " . $exam->getStudentName() . "\n";

            $manager->persist($exam);
        }

        $manager->flush();
    }
}
